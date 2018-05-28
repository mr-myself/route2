class Route < ApplicationRecord
  belongs_to :user

  has_one :route_step, dependent: :destroy
  has_many :mapping_route_spots, class_name: 'Mapping::RouteSpot'
  has_many :spots, through: :mapping_route_spots

  after_initialize :set_key

  def set_key
    return unless key.nil?

    key = ''.tap{|string| 10.times { string << rand(9).to_s }}
    Route.find_by(key: key) ? set_key : self.key = key
  end

  def destination
    Spot.find(self.destination_id)
  end
end
