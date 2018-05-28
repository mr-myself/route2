class CreateRoutes < ActiveRecord::Migration[5.2]
  def change
    create_table :routes do |t|
      t.references :user, index: true
      t.references :destination, index: true, references: :spots
      t.string :key
      t.float :distance
      t.float :elevation_gain
      t.timestamps null: false
    end
  end
end
