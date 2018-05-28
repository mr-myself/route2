class Api::PlanningController < Api::ApiController
  before_action :validate_two_positions_parameters, except: %i[destinations]

  def create
    ActiveRecord::Base.transaction do
      @route = current_user.routes.create(
        destination_id: params[:destinationId],
        distance: params[:distance],
        elevation_gain: params[:elevation],
        start_address: params[:startAddress]
      )
      @route.create_route_step(steps: params[:steps])

      if params[:selectedSpots]
        mapping = [].tap do |ary|
          params[:selectedSpots].each.with_index(1) do |spot_id, index|
            ary << Mapping::RouteSpot.new(
              route_id: @route.id, spot_id: spot_id, order: index
            )
          end
        end
        Mapping::RouteSpot.import mapping
      end
    end

    render json: { status: 200, key: @route.key }, status: :ok

  rescue ActiveRecord::RecordInvalid => exception
    Rails.logger.error("Faild to create a route[user: #{current_user.id}] => #{exception}")
    render json: { status: 500, key: @route.key }, status: 500
  end

  def destinations
    raise 400 unless params[:startPosition] && params[:from] && params[:to]

    exceptions_id = Spot.near(
      parsed_start_position,
      params[:from].to_i,
      order: false
    ).pluck(:id)

    target_spots = Spot
      .where.not(id: exceptions_id)
      .where(category: params[:category] || Spot.categories.keys)
      .near(
        parsed_start_position,
        params[:to].to_i,
        order: false
      )

    destinations = []
    target_spots.order('distance ASC').limit(50).each do |spot|
      destinations << {
        id: spot.id,
        photo_url: spot.spot_photos.first.photo.url,
        title: spot.title,
        distance: spot.distance.round(1),
        latitude: spot.latitude,
        longitude: spot.longitude,
        address: spot.address
      }
    end

    render json: {
      status: 200,
      destinations: destinations
    }, status: :ok
  end

  def spots
    destination = Spot.find(params[:destinationId])

    two_positions_geocoder = ::TwoPositionsGeocoder.new(
      parsed_start_position,
      [destination.latitude, destination.longitude]
    )

    spots = []
    [
      two_positions_geocoder.first_bounding_box,
      two_positions_geocoder.second_bounding_box,
      two_positions_geocoder.third_bounding_box,
      two_positions_geocoder.forth_bounding_box
    ].each do |bounding_box|
      Spot.within_bounding_box(bounding_box)
        .order('RANDOM()').limit(15).each do |spot|
        spots << {
          id: spot.id,
          photo_url: spot.spot_photos.first.photo.url,
          title: spot.title,
          latitude: spot.latitude,
          longitude: spot.longitude,
        }
      end
    end

    render json: { status: 200, spots: spots }, status: :ok
  end

  def center_position
    destination = Spot.find(params[:destinationId])

    two_positions_geocoder = ::TwoPositionsGeocoder.new(
      parsed_start_position,
      [destination.latitude, destination.longitude]
    )

    render json: {
      status: 200,
      center_position: two_positions_geocoder.exact_center_position
    }, status: :ok
  end

private

  def parsed_start_position
    start_position = JSON.parse(params[:startPosition])
    [start_position['lat'], start_position['lng']]
  end

  def validate_two_positions_parameters
    raise unless params[:startPosition] && params[:destinationId]
  end
end
