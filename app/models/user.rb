class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable,
         :omniauthable, omniauth_providers: %i[facebook]

  validates_presence_of :name
  before_save :set_role

  has_many :routes

  enum role: {
    admin: 1,
    general: 2
  }

private

  def set_role
    self.role = 'general' unless self.role
  end
end
