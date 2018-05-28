class SpotPhoto < ApplicationRecord
  belongs_to :spot

  has_attached_file :photo,
    styles: { medium: "600x600>", thumb: "100x100>" },
    path: "#{Rails.root}/public/system/#{Rails.env}/photos/:id/:style/:filename",
    url: "/system/#{Rails.env}/photos/:id/:style/:filename"

  validates_attachment_content_type :photo, content_type: /\Aimage\/.*\Z/

  validates_presence_of :photo
end
