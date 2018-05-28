require "administrate/base_dashboard"

class SpotDashboard < Administrate::BaseDashboard
  # ATTRIBUTE_TYPES
  # a hash that describes the type of each of the model's fields.
  #
  # Each different type represents an Administrate::Field object,
  # which determines how the attribute is displayed
  # on pages throughout the dashboard.
  ATTRIBUTE_TYPES = {
    spot_photo: Field::Paperclip.with_options(thumbnail_style: 'thumb'),
    spot_photos: Field::HasMany,
    id: Field::Number,
    title: Field::String,
    place_id: Field::String,
    address: Field::String,
    latitude: Field::Number.with_options(decimals: 2),
    longitude: Field::Number.with_options(decimals: 2),
    category: EnumField,
    created_at: Field::DateTime,
    updated_at: Field::DateTime,
  }.freeze

  # COLLECTION_ATTRIBUTES
  # an array of attributes that will be displayed on the model's index page.
  #
  # By default, it's limited to four items to reduce clutter on index pages.
  # Feel free to add, remove, or rearrange items.
  COLLECTION_ATTRIBUTES = [
    :id,
    :title,
    :category,
    :place_id
  ].freeze

  # SHOW_PAGE_ATTRIBUTES
  # an array of attributes that will be displayed on the model's show page.
  SHOW_PAGE_ATTRIBUTES = [
    :spot_photos,
    :id,
    :title,
    :place_id,
    :address,
    :latitude,
    :longitude,
    :category,
    :created_at,
    :updated_at,
  ].freeze

  # FORM_ATTRIBUTES
  # an array of attributes that will be displayed
  # on the model's form (`new` and `edit`) pages.
  FORM_ATTRIBUTES = [
    :spot_photo,
    :title,
    :address,
    :place_id,
    :latitude,
    :longitude,
    :category,
  ].freeze

  # Overwrite this method to customize how spots are displayed
  # across all pages of the admin dashboard.
  #
  # def display_resource(spot)
  #   "Spot ##{spot.id}"
  # end
end
