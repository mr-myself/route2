class RouteGpxCreator

  def self.create(file_instance, route)
    instance = new(file_instance, route)
    instance.set_header
    instance.set_body
    instance.set_footer

    instance.f
  end

  attr_accessor :f
  attr_reader :route

  def initialize(file_instance, route)
    @f = file_instance
    @route = route
  end

  def set_header
    f.puts '<?xml version="1.0" encoding="UTF-8"?>'
    f.puts '<gpx version="1.0" creator="Create GPX Route with Google Maps API v3" xmlns="http://www.topografix.com/GPX/1/0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.topografix.com/GPX/1/0 http://www.topografix.com/GPX/1/0/gpx.xsd">'
    f.puts '<desc>地図データ ©2018 Google, ZENRIN</desc>'
    f.puts '<url>https://route2.co</url>'
    f.puts '<trk>'
    f.puts "<name>#{route.destination.title}へのルート</name>"
    f.puts '<trkseg>'
  end

  def set_body
    @route.route_step.steps.each.with_index(1) do |step, index|
      f.puts "<trkpt lat=\"#{step['latitude']}\" lon=\"#{step['longitude']}\">"
      f.puts " <time>#{(Time.now + index.minute).strftime('%Y-%m-%dT%H:%M:%SZ')}</time>"
      f.puts '</trkpt>'
    end
  end

  def set_footer
    f.puts '</trkseg>'
    f.puts '</trk>'
    f.puts '</gpx>'
  end
end
