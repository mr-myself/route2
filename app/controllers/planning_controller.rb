class PlanningController < ApplicationController
  before_action :check_authentication, except: :show

  def index
    @routes = current_user.routes
  end

  def new; end

  def show
    @route = Route.find_by(key: params[:key])
    redirect_to root_path unless @route
  end

  def gpx
    @route = Route.find_by(key: params[:planning_key])
    redirect_to root_path unless @route

    file_path = Rails.root.join(
      'tmp', 'storage', "Route2_#{@route.key}.gpx"
    ).to_s

    File.open(file_path, 'w') do |f|
      RouteGpxCreator.create(f, @route)
    end

    send_file(
      file_path,
      type: 'application/gpx+xml'
    )
  end

private

  def check_authentication
    redirect_to root_path unless user_signed_in?
  end
end
