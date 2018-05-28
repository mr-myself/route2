module Admin
  class SpotsController < Admin::ApplicationController
    # To customize the behavior of this controller,
    # you can overwrite any of the RESTful actions. For example:
    #
    # def index
    #   super
    #   @resources = Spot.
    #     page(params[:page]).
    #     per(10)
    # end

    # Define a custom finder by overriding the `find_resource` method:
    # def find_resource(param)
    #   Spot.find_by!(slug: param)
    # end

    # See https://administrate-prototype.herokuapp.com/customizing_controller_actions
    # for more information
    def create
      @spot = Spot.new(spot_params)
      @spot.spot_photos.new(photo: params[:spot][:spot_photo])

      if @spot.save
        redirect_to admin_spots_path, notice: translate_with_resource("create.success")
      else
        render :new, locals: {
          page: Administrate::Page::Form.new(dashboard, @spot),
        }
      end
    end

    def update
      if requested_resource.update(spot_params)
        if params[:spot][:spot_photo].present?
          requested_resource.spot_photos.destroy_all
          requested_resource.spot_photos.create(photo: params[:spot][:spot_photo])
        end
        redirect_to admin_spots_path, notice: translate_with_resource("update.success")
      else
        render :edit, locals: {
          page: Administrate::Page::Form.new(dashboard, requested_resource),
        }
      end
    end

    private

    def spot_params
      params.require(:spot).permit(
        :title, :latitude, :longitude, :category, :place_id, :address
      )
    end
  end
end
