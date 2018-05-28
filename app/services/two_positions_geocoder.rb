class TwoPositionsGeocoder

  attr_reader :start_position, :end_position,
              :distance_between, :center_position, :bounding_box,
              :exact_center_position, :start_half_center_position,
              :end_half_center_position

  def initialize(start_position, end_position)
    @start_position = start_position
    @end_position = end_position
  end

  def exact_center_position
    exact_center_position ||= Geocoder::Calculations.geographic_center([
      [start_position[0], start_position[1]],
      [end_position[0], end_position[1]]
    ])
  end

  def start_half_center_position
    start_half_center_position ||= Geocoder::Calculations.geographic_center([
      [start_position[0], start_position[1]],
      [exact_center_position[0], exact_center_position[1]]
    ])
  end

  def end_half_center_position
    end_half_center_position ||= Geocoder::Calculations.geographic_center([
      [end_position[0], end_position[1]],
      [exact_center_position[0], exact_center_position[1]]
    ])
  end

  def first_bounding_box
    center_position = center_position(
      start_half_center_position, start_position
    )

    bounding_box(center_position, distance_between(
      center_position, start_position
    ))
  end

  def second_bounding_box
    center_position = center_position(
      exact_center_position, start_half_center_position
    )

    bounding_box(center_position, distance_between(
      center_position, exact_center_position
    ))
  end

  def third_bounding_box
    center_position = center_position(
      exact_center_position, end_half_center_position
    )

    bounding_box(center_position, distance_between(
      center_position, exact_center_position
    ))
  end

  def forth_bounding_box
    center_position = center_position(
      end_position, end_half_center_position
    )

    bounding_box(center_position, distance_between(
      center_position, end_position
    ))
  end

  def distance_between(first_position, second_position)
    distance_between ||= Geocoder::Calculations.distance_between(
      [first_position[0], first_position[1]],
      [second_position[0], second_position[1]]
    )
  end

  def center_position(first_position, second_position)
    center_position ||= Geocoder::Calculations.geographic_center([
      [first_position[0], first_position[1]],
      [second_position[0], second_position[1]]
    ])
  end

  def bounding_box(center_position, distance_between)
    bounding_box ||= Geocoder::Calculations.bounding_box(
      center_position, distance_between
    )
  end
end
