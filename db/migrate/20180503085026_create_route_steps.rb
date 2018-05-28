class CreateRouteSteps < ActiveRecord::Migration[5.2]
  def change
    create_table :route_steps do |t|
      t.references :route, index: true
      t.jsonb :steps
      t.timestamps null: false
    end
  end
end
