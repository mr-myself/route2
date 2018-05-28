# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2018_05_05_064836) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "mapping_route_spots", force: :cascade do |t|
    t.bigint "route_id"
    t.bigint "spot_id"
    t.integer "order"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["route_id"], name: "index_mapping_route_spots_on_route_id"
    t.index ["spot_id"], name: "index_mapping_route_spots_on_spot_id"
  end

  create_table "route_steps", force: :cascade do |t|
    t.bigint "route_id"
    t.jsonb "steps"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["route_id"], name: "index_route_steps_on_route_id"
  end

  create_table "routes", force: :cascade do |t|
    t.bigint "user_id"
    t.bigint "destination_id"
    t.string "key"
    t.float "distance"
    t.float "elevation_gain"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "start_address"
    t.index ["destination_id"], name: "index_routes_on_destination_id"
    t.index ["user_id"], name: "index_routes_on_user_id"
  end

  create_table "spot_photos", force: :cascade do |t|
    t.bigint "spot_id"
    t.string "photo_file_name"
    t.string "photo_content_type"
    t.integer "photo_file_size"
    t.datetime "photo_updated_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["spot_id"], name: "index_spot_photos_on_spot_id"
  end

  create_table "spots", force: :cascade do |t|
    t.string "title", null: false
    t.float "latitude"
    t.float "longitude"
    t.integer "category"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "place_id"
    t.string "address"
  end

  create_table "users", force: :cascade do |t|
    t.string "name", default: "", null: false
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "provider"
    t.string "uid"
    t.integer "role"
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer "sign_in_count", default: 0, null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.inet "current_sign_in_ip"
    t.inet "last_sign_in_ip"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "remember_token"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

end
