class HomeController < ApplicationController

  def index
    if user_signed_in?
      redirect_to new_planning_path
    else
      redirect_to new_user_registration_path
    end
  end

  def privacy_policy; end
end
