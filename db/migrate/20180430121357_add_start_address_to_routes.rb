class AddStartAddressToRoutes < ActiveRecord::Migration[5.2]
  def change
    add_column :routes, :start_address, :string
  end
end
