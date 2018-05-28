class CreateMappingRouteSpots < ActiveRecord::Migration[5.2]
  def change
    create_table :mapping_route_spots do |t|
      t.belongs_to :route, index: true
      t.belongs_to :spot,  index: true
      t.integer :order
      t.timestamps null: false
    end
  end
end
