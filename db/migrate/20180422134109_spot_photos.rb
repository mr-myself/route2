class SpotPhotos < ActiveRecord::Migration[5.2]
  def change
    create_table :spot_photos do |t|
      t.references :spot, index: true
      t.attachment :photo

      t.timestamps null: false
    end
  end
end
