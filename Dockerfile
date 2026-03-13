# Use official Ruby image
FROM ruby:3.3-slim

# Install Node.js & Yarn (needed for Rails asset pipeline)
RUN apt-get update -qq && \
    apt-get install -y --no-install-recommends \
        nodejs npm build-essential \
        libpq-dev && \
    npm install -g yarn && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy Gemfile & Gemfile.lock if present later in build context
COPY Gemfile* ./
RUN bundle config set without "development test" && \
    bundle install --jobs 4 --retry 3 || true

# Copy rest of app
COPY . .

EXPOSE 3000

CMD ["bundle", "exec", "rails", "server", "-b", "0.0.0.0", "-p", "3000"]
