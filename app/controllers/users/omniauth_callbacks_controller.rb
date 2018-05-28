class Users::OmniauthCallbacksController < Devise::OmniauthCallbacksController
  include Devise::Controllers::Rememberable

  def facebook
    auth = request.env['omniauth.auth']
    find_or_create_user(auth)
    remember_me(@user)
    sign_in(@user)

    redirect_to new_planning_path
  end

private

  def find_or_create_user(auth)
    return if @user = User.find_by(
      provider: auth.provider,
      uid: auth.uid
    )

    @user = User.create(
      name: auth.info.name,
      email: auth.info.email,
      provider: auth.provider,
      uid: auth.uid
    )
  end
end
