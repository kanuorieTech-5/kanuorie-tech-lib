$ErrorActionPreference = "Stop"

# Run from the KanuorieTech project root.
$root = (Get-Location).Path
$files = @{
  Referral = Join-Path $root "backend\src\models\AffiliateReferral.js"
  AffiliateController = Join-Path $root "backend\src\controllers\affiliateController.js"
  AdminController = Join-Path $root "backend\src\controllers\adminOperationsController.js"
}
foreach ($path in $files.Values) {
  if (-not (Test-Path -LiteralPath $path)) { throw "Required file not found: $path. Run this script from the project root." }
}

$stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$backupDir = Join-Path $root "backend\_backups\affiliate-payout-reservation-$stamp"
New-Item -ItemType Directory -Path $backupDir -Force | Out-Null
foreach ($entry in $files.GetEnumerator()) {
  Copy-Item -LiteralPath $entry.Value -Destination (Join-Path $backupDir ([IO.Path]::GetFileName($entry.Value)))
}
Write-Host "Backups created at: $backupDir" -ForegroundColor Cyan

function Replace-Once([string]$Text, [string]$Pattern, [string]$Replacement, [string]$Description) {
  $regex = [regex]::new($Pattern, [System.Text.RegularExpressions.RegexOptions]::Singleline)
  $matches = $regex.Matches($Text)
  if ($matches.Count -ne 1) { throw "Expected exactly one match for '$Description'; found $($matches.Count). No further changes will be made to this file." }
  $match = $matches[0]
  return $Text.Substring(0, $match.Index) + $Replacement + $Text.Substring($match.Index + $match.Length)
}

# 1) Add a nullable reservation pointer to each commission record.
$referralPath = $files.Referral
$referralText = [IO.File]::ReadAllText($referralPath)
if ($referralText -notmatch 'payoutReservation\s*:') {
  $referralReplacement = @'
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      default: null,
      index: true,
    },
    // The payout currently reserving this commission. Cleared if that payout is rejected.
    payoutReservation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AffiliatePayout",
      default: null,
      index: true,
    },
'@
  $referralText = Replace-Once $referralText '(?m)^\s{4}order:\s*\{\s*\r?\n\s{6}type: mongoose\.Schema\.Types\.ObjectId,\s*\r?\n\s{6}ref: "Order",\s*\r?\n\s{6}default: null,\s*\r?\n\s{6}index: true,\s*\r?\n\s{4}\},' $referralReplacement 'AffiliateReferral.order schema field'
  [IO.File]::WriteAllText($referralPath, $referralText, [Text.UTF8Encoding]::new($false))
  Write-Host "Added AffiliateReferral.payoutReservation" -ForegroundColor Green
} else {
  Write-Host "AffiliateReferral already has payoutReservation; leaving schema field unchanged." -ForegroundColor Yellow
}

# 2) Make affiliate payout requests transactional and reserve the exact commission records.
$affiliatePath = $files.AffiliateController
$affiliateText = [IO.File]::ReadAllText($affiliatePath)
$newRequestFunction = @'
const requestAffiliatePayout = async (req, res, next) => {
  let session;
  try {
    const affiliate = await Affiliate.findOne({ user: req.user._id });

    if (!affiliate) {
      return res.status(404).json({ success: false, message: "Affiliate account not found." });
    }
    if (affiliate.status !== "active") {
      return res.status(400).json({ success: false, message: "Your affiliate account is not active." });
    }
    if (!affiliate.payoutMethod) {
      return res.status(400).json({ success: false, message: "Please configure your payout information first." });
    }

    session = await AffiliatePayout.startSession();
    let createdPayoutId;

    await session.withTransaction(async () => {
      // Re-check inside the transaction to avoid ordinary duplicate outstanding requests.
      const existingPayout = await AffiliatePayout.findOne({
        affiliate: affiliate._id,
        status: { $in: ["requested", "processing"] },
      }).select("_id status").session(session);

      if (existingPayout) {
        const error = new Error("You already have an outstanding payout request.");
        error.statusCode = 409;
        throw error;
      }

      // Exclude commissions linked to older outstanding payouts that predate reservations.
      const outstandingPayouts = await AffiliatePayout.find({
        affiliate: affiliate._id,
        status: { $in: ["requested", "processing"] },
      }).select("referrals").session(session);
      const alreadyLinkedIds = outstandingPayouts.flatMap((item) => item.referrals || []);

      const referralFilter = {
        affiliate: affiliate._id,
        commissionStatus: "approved",
        commissionAmount: { $gt: 0 },
        _id: { $nin: alreadyLinkedIds },
        $or: [
          { payoutReservation: null },
          { payoutReservation: { $exists: false } },
        ],
      };

      const referrals = await AffiliateReferral.find(referralFilter)
        .select("_id commissionAmount commissionCurrency")
        .session(session);

      if (!referrals.length) {
        const error = new Error("There are no approved earnings available for payout.");
        error.statusCode = 400;
        throw error;
      }

      const currencies = [...new Set(referrals.map((item) =>
        String(item.commissionCurrency || "USD").toUpperCase()
      ))];
      if (currencies.length !== 1 || currencies[0] !== "USD") {
        const error = new Error("These commissions cannot be paid together because their currencies are not all USD.");
        error.statusCode = 400;
        throw error;
      }

      const amount = referrals.reduce((total, referral) =>
        total + (Number(referral.commissionAmount) || 0), 0
      );
      if (!Number.isFinite(amount) || amount <= 0) {
        const error = new Error("The payout amount is invalid.");
        error.statusCode = 400;
        throw error;
      }

      const [payout] = await AffiliatePayout.create([{
        affiliate: affiliate._id,
        referrals: referrals.map((referral) => referral._id),
        amount,
        currency: "USD",
        payoutMethod: affiliate.payoutMethod,
        payoutDetails: affiliate.payoutDetails,
        status: "requested",
        requestedAt: new Date(),
      }], { session });

      // Claim only commissions that are still approved and unreserved.
      const reservationUpdate = await AffiliateReferral.updateMany(
        {
          ...referralFilter,
          _id: { $in: referrals.map((referral) => referral._id) },
        },
        { $set: { payoutReservation: payout._id } },
        { session }
      );

      if (reservationUpdate.modifiedCount !== referrals.length) {
        const error = new Error("Some commissions were reserved by another payout request. Please retry.");
        error.statusCode = 409;
        throw error;
      }

      createdPayoutId = payout._id;
    });

    const payout = await AffiliatePayout.findById(createdPayoutId);
    if (!payout) {
      return res.status(500).json({ success: false, message: "Payout was created but could not be retrieved." });
    }

    return res.status(201).json({
      success: true,
      message: "Affiliate payout requested successfully.",
      data: {
        payout: {
          ...payout.toObject(),
          payoutDetails: formatPayoutDetails(payout.payoutDetails),
        },
      },
    });
  } catch (error) {
    next(error);
  } finally {
    if (session) await session.endSession();
  }
};
'@
$affiliateText = Replace-Once $affiliateText '(?s)const requestAffiliatePayout = async \(req, res, next\) => \{.*?\r?\n\s*\};' $newRequestFunction 'requestAffiliatePayout controller function'
[IO.File]::WriteAllText($affiliatePath, $affiliateText, [Text.UTF8Encoding]::new($false))
Write-Host "Updated requestAffiliatePayout to reserve commissions transactionally" -ForegroundColor Green

# 3) Keep reservation ownership consistent when admins mark payouts paid or rejected.
$adminPath = $files.AdminController
$adminText = [IO.File]::ReadAllText($adminPath)
$newAdminFunction = @'
const updateOperationsPayoutStatus = async (
  req,
  res,
  next
) => {
  const { status, reference, rejectionReason } = req.body;
  const allowedStatuses = ["processing", "paid", "rejected"];

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ success: false, message: "Invalid payout status." });
  }
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).json({ success: false, message: "Invalid payout ID." });
  }
  if (status === "paid" && !String(reference || "").trim()) {
    return res.status(400).json({
      success: false,
      message: "Enter the payment reference before marking a payout as paid.",
    });
  }
  if (status === "rejected" && !String(rejectionReason || "").trim()) {
    return res.status(400).json({
      success: false,
      message: "Provide a reason for rejecting this payout.",
    });
  }

  let session;
  try {
    session = await mongoose.startSession();
    let updatedPayout;

    await session.withTransaction(async () => {
      const payout = await AffiliatePayout.findById(req.params.id).session(session);
      if (!payout) {
        const error = new Error("Payout request not found.");
        error.statusCode = 404;
        throw error;
      }
      if (!["requested", "processing"].includes(payout.status)) {
        const error = new Error(`This payout has already been ${payout.status} and cannot be processed again.`);
        error.statusCode = 409;
        throw error;
      }

      const now = new Date();
      const referralIds = payout.referrals || [];

      if (status === "paid") {
        if (!referralIds.length) {
          const error = new Error("This payout has no linked commission records. Reconcile it before marking it paid.");
          error.statusCode = 409;
          throw error;
        }

        // Accept unreserved legacy records, but never pay a commission reserved by a different payout.
        const eligibleFilter = {
          _id: { $in: referralIds },
          affiliate: payout.affiliate,
          commissionStatus: "approved",
          $or: [
            { payoutReservation: payout._id },
            { payoutReservation: null },
            { payoutReservation: { $exists: false } },
          ],
        };
        const eligibleReferrals = await AffiliateReferral.find(eligibleFilter)
          .select("_id")
          .session(session);

        if (eligibleReferrals.length !== referralIds.length) {
          const error = new Error("The linked commissions have changed or are reserved by another payout. Review this payout before proceeding.");
          error.statusCode = 409;
          throw error;
        }

        const referralUpdate = await AffiliateReferral.updateMany(
          eligibleFilter,
          { $set: { commissionStatus: "paid", paidAt: now, payoutReservation: payout._id } },
          { session }
        );
        if (referralUpdate.modifiedCount !== referralIds.length) {
          const error = new Error("Not all linked commissions could be marked paid. The payout update was cancelled.");
          error.statusCode = 409;
          throw error;
        }
      }

      if (status === "rejected" && referralIds.length) {
        // Only release records owned by this payout; never clear another payout's reservation.
        await AffiliateReferral.updateMany(
          {
            _id: { $in: referralIds },
            affiliate: payout.affiliate,
            commissionStatus: "approved",
            payoutReservation: payout._id,
          },
          { $set: { payoutReservation: null } },
          { session }
        );
      }

      payout.status = status;
      payout.processedAt = now;
      if (status === "paid") {
        payout.paidAt = now;
        payout.reference = String(reference).trim();
        payout.rejectionReason = "";
      } else if (status === "rejected") {
        payout.rejectionReason = String(rejectionReason).trim();
        payout.paidAt = null;
      }
      await payout.save({ session });
      updatedPayout = payout._id;
    });

    const result = await AffiliatePayout.findById(updatedPayout)
      .populate({
        path: "affiliate",
        populate: { path: "user", select: "firstName lastName email" },
      })
      .populate("referrals")
      .lean();

    return res.status(200).json({
      success: true,
      message: status === "paid"
        ? "Payout marked paid and linked commissions updated."
        : status === "rejected"
          ? "Payout request rejected and its commission reservations released."
          : "Payout moved to processing.",
      data: { payout: result },
    });
  } catch (error) {
    next(error);
  } finally {
    if (session) await session.endSession();
  }
};
'@
$adminText = Replace-Once $adminText '(?s)const updateOperationsPayoutStatus = async \(\s*req,\s*res,\s*next\s*\) => \{.*?\r?\n\s*\};' $newAdminFunction 'updateOperationsPayoutStatus controller function'
[IO.File]::WriteAllText($adminPath, $adminText, [Text.UTF8Encoding]::new($false))
Write-Host "Updated admin payout processing and reservation release" -ForegroundColor Green

# Syntax-check all modified JavaScript files. Backups are retained for rollback.
node --check $files.Referral
if ($LASTEXITCODE -ne 0) { throw "AffiliateReferral.js syntax check failed. Restore files from $backupDir." }
node --check $files.AffiliateController
if ($LASTEXITCODE -ne 0) { throw "affiliateController.js syntax check failed. Restore files from $backupDir." }
node --check $files.AdminController
if ($LASTEXITCODE -ne 0) { throw "adminOperationsController.js syntax check failed. Restore files from $backupDir." }

Write-Host "All three JavaScript syntax checks passed." -ForegroundColor Green
Write-Host "Backup folder: $backupDir" -ForegroundColor Cyan
Write-Host "Next: test requesting a payout, moving it to processing, rejecting it, requesting again, and marking a payout paid with a reference." -ForegroundColor Yellow
