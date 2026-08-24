const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      minlength: 2,
      maxlength: 50,
    },

    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      minlength: 2,
      maxlength: 50,
    },

   email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
  },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false,
    },

    avatar: {
      type: String,
      default: null,
    },

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    bio: {
      type:String,
      trim:true,
      maxlength:500,
      default:"",
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    isBlocked: {
      type: Boolean,
      default: false,
    },

    emailVerificationToken: {
      type: String,
      default: "",
    },

    passwordResetToken: {
      type: String,
      default: null,
    },

    passwordResetExpires: {
      type: Date,
      default: null,
    },
    passwordChangedAt:{
      type:Date,
      default:null
    },
    lastLogin: {
      type: Date,
      default: null,
    },

    loginCount: {
      type: Number,
      default: 0,
    },
    lastSeen: {
      type: Date,
      default: Date.now,
    },
    settings: {
      theme: {
        type: String,
        enum: ["light", "dark", "system"],
        default: "system",
      },

      language: {
        type: String,
        default: "en",
      },

      notifications: {
        courses: {
          type: Boolean,
          default: true,
        },

        resources: {
          type: Boolean,
          default: true,
        },

        products: {
          type: Boolean,
          default: true,
        },

        account: {
          type: Boolean,
          default: true,
        },

        promotions: {
          type: Boolean,
          default: false,
        },
      },

      emailPreferences: {
        security: {
          type: Boolean,
          default: true,
        },

        courses: {
          type: Boolean,
          default: true,
        },

        resources: {
          type: Boolean,
          default: true,
        },

        products: {
          type: Boolean,
          default: true,
        },

        newsletter: {
          type: Boolean,
          default: true,
        },

        promotions: {
          type: Boolean,
          default: false,
        },
      },

      // Kept for backward compatibility
      emailNotifications: {
        type: Boolean,
        default: true,
      },

      pushNotifications: {
        type: Boolean,
        default: true,
      },
    },
  },
  {
    timestamps: true,

    toJSON: {
      virtuals: true,
    },

    toObject: {
      virtuals: true,
    },
}
);
userSchema.pre("validate", function (next) {
  if (this.email) {
    this.email = this.email.toLowerCase().trim();
  }

  next();
});
/* =========================
   HASH PASSWORD
========================= */

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  this.passwordChangedAt = new Date();

  next();
});
/* =========================
   COMPARE PASSWORD
========================= */

userSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

/* =========================
   FULL NAME
========================= */

userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

/* =========================
   REMOVE SENSITIVE DATA
========================= */

userSchema.methods.toJSON = function () {
  const user = this.toObject({ virtuals: true });

  delete user.password;
  delete user.passwordResetToken;
  delete user.passwordResetExpires;
  delete user.emailVerificationToken;
  return user;
};
userSchema.methods.incrementLogin = async function () {
  this.lastLogin = new Date();
  this.loginCount += 1;

  return this.save();
};
/* =========================
   INDEXES
========================= */
userSchema.index({
  role: 1,
  isVerified:1,
  isBlocked:1,
  createdAt: -1,
});

module.exports = mongoose.model("User", userSchema);