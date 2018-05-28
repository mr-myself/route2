require 'capistrano/setup'
require 'capistrano/deploy'
require 'capistrano/rbenv'
require 'capistrano/bundler'
require 'capistrano/rails/assets'
require 'capistrano/puma'
require 'capistrano/scm/git'
require 'capistrano/rails/migrations'
#require 'whenever/capistrano'
#require 'capistrano/sidekiq'

install_plugin Capistrano::Puma
install_plugin Capistrano::SCM::Git

# Load custom tasks from `lib/capistrano/tasks` if you have any defined
Dir.glob('lib/capistrano/tasks/*.rake').each { |r| import r }
