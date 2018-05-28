# config valid for current version and patch releases of Capistrano
lock "~> 3.10.2"

set :application, "route2"
set :repo_url, "git@bitbucket.org:mr-myself/route2.git"
set :user, 'deploy'
set :deploy_to, "/home/#{fetch(:user)}/#{fetch(:application)}"

set :rbenv_ruby, File.read(
  File.expand_path('.ruby-version', Dir.pwd)
).strip
set :format, :pretty

set :pty, true

set :linked_files, fetch(:linked_files, []).push('.rbenv-vars')
set :linked_dirs, fetch(:linked_dirs, []).push('log', 'tmp/pids', 'tmp/cache', 'tmp/sockets', 'tmp/storage', 'vendor/bundle', 'public/system')


set :keep_releases, 3

set :ssh_options, verify_host_key: :secure, forward_agent: true, user: fetch(:user)

set :puma_bind,       "unix://#{shared_path}/tmp/sockets/#{fetch(:application)}-puma.sock"
set :puma_state,      "#{shared_path}/tmp/pids/puma.state"
set :puma_pid,        "#{shared_path}/tmp/pids/puma.pid"
set :puma_access_log, "#{release_path}/log/puma.access.log"
set :puma_error_log,  "#{release_path}/log/puma.error.log"
set :puma_preload_app, false  # Prune_bundle instead of preload to avoid problem when changing rbenv-vars
set :puma_prune_bundler, true # Prune_bundle instead of preload to avoid problem when changing rbenv-vars
set :puma_worker_timeout, nil
set :puma_init_active_record, true

set :assets_roles, [:web, :app]

namespace :deploy do
  desc 'Make sure local git is in sync with remote.'
  task :check_revision do
    on roles(:app) do
      unless `git rev-parse HEAD` == `git rev-parse origin/#{fetch(:branch)}`
        puts "WARNING: HEAD is not the same as origin/#{fetch(:branch)}"
        puts 'Run `git push` to sync changes.'
        exit
      end
    end
  end

  desc 'Initial Deploy'
  task :initial do
    on roles(:app) do
      before 'deploy:restart', 'puma:start'
      invoke 'deploy'
    end
  end

  desc 'install npm libraries'
  task :install_npm_libraries do
    on roles(:app) do
      within release_path.to_s do
        execute :yarn, 'install'
      end
    end
  end

  task :precompile_assets do
    on roles(:app) do
      within release_path.to_s do
        with rails_env: fetch(:stage) do
          execute :bundle, "exec rake webpacker:compile"
        end
      end
    end
  end

  before :starting,  :check_revision
  after  :finishing, :install_npm_libraries
  after  :finishing, :precompile_assets
  after  :finishing, :cleanup
  after  :finishing, :restart
end

namespace :puma do
  desc 'Create Directories for Puma Pids and Socket'
  task :make_dirs do
    on roles(:app) do
      execute "mkdir #{shared_path}/tmp/sockets -p"
      execute "mkdir #{shared_path}/tmp/pids -p"
    end
  end

  before :start, :make_dirs
end

namespace :symlinks do

  task :nginx_conf do
    on roles(:web) do
      execute :sudo, "ln -sf /home/#{fetch(:user)}/#{fetch(:application)}/current/config/nginx/production.conf /etc/nginx/conf.d/#{fetch(:application)}.conf"
    end
  end

  after 'deploy:finishing', 'symlinks:nginx_conf'
end
