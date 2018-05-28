class Mapping::RouteSpot < ApplicationRecord
  belongs_to :route
  belongs_to :spot

  validates_presence_of :order
end
