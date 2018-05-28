set :stage, :production
set :rails_env, 'production'
set :branch, :master

web_servers = %w[deploy@160.16.84.117]

role :app, web_servers
role :web, web_servers
role :db, web_servers
set :database_name, 'route2_production'

set :puma_threads, [2, 4]
set :puma_workers, 2
