class AddPalceIdToSpots < ActiveRecord::Migration[5.2]
  def change
    add_column :spots, :place_id, :string
  end
end
