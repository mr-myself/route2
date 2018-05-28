class Spot < ApplicationRecord
  has_many :spot_photos, dependent: :destroy
  has_many :mapping_route_spots, class_name: 'Mapping::RouteSpot'
  has_many :routes, through: :mapping_route_spots

  validates_presence_of :title, :latitude, :longitude, :category

  reverse_geocoded_by :latitude, :longitude

  enum category: {
    restaurant: 1,
    park: 2,
    mountain: 3,
    others: 4,
  }
end
