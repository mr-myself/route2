class Spots < ActiveRecord::Migration[5.2]
  def change
    create_table :spots do |t|
      t.string :title, null: false
      t.float :latitude
      t.float :longitude
      t.integer :category

      t.timestamps null: false
    end
  end
end
