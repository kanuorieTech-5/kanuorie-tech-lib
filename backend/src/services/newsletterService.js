const Newsletter = require("../models/Newsletter");

class NewsletterService {

  async subscribe(email) {

    let subscriber = await Newsletter.findOne({ email });

    if (subscriber) {

      subscriber.subscribed = true;
      subscriber.unsubscribedAt = null;

      await subscriber.save();

      return subscriber;
    }

    return Newsletter.create({
      email,
    });

  }

  async unsubscribe(email) {

    return Newsletter.findOneAndUpdate(
      { email },
      {
        subscribed: false,
        unsubscribedAt: new Date(),
      },
      {
        new: true,
      }
    );

  }

  async getSubscribers(query = {}) {

    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = {};

    if (query.subscribed !== undefined) {
      filter.subscribed = query.subscribed === "true";
    }

    const [items, total] = await Promise.all([

      Newsletter.find(filter)
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(limit),

      Newsletter.countDocuments(filter),

    ]);

    return {

      items,

      pagination: {

        page,

        limit,

        total,

        pages: Math.ceil(total / limit),

      },

    };

  }

  async delete(id) {
    return Newsletter.findByIdAndDelete(id);
  }

}

module.exports = new NewsletterService();