Rails.application.routes.draw do
  root to: 'home#index'
  get :privacy_policy, to: 'home#privacy_policy'

  resources :planning, only: %i[index new show], param: :key do
    get :gpx
  end

  devise_for :users, only: %i[omniauth_callbacks sessions registrations], controllers: {
    omniauth_callbacks: 'users/omniauth_callbacks'
  }

  namespace :api, defaults: { format: :json } do
    scope :planning, controller: :planning, as: :planning do
      post '/', action: :create
      get  :destinations
      get  :spots
      get  :center_position
    end
  end

  namespace :admin do
    resources :users
    resources :spots
    resources :routes
    resources :spot_photos
  end
end
