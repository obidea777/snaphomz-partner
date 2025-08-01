/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    domains: [
      'raw.githubusercontent.com',
      'res.cloudinary.com',
      'dx41nk9nsacii.cloudfront.net',
      '*.amazonaws.com',
      'example.com',
      'images.unsplash.com',
      'ocrealstoragebucket.s3.eu-north-1.amazonaws.com',
      'dx41nk9nsacii.cloudfront.net',
      'xomesearch.propertiescdn.com',
      'ssl.cdn-redfin.com',
      'www.compass.com',
      'maps.googleapis.com',
      'images1.apartments.com',
      'images1.forrent.com',
      'pi.movoto.com',
      'images.estately.net',
      's1.rea.global',
      'ssl.cdn-redfin.com',
      'ssl.cdn-redfin.com',
      'i.pravatar.cc',
      'imagecdn.realty.com',
      'snaphomz.s3.eu-north-1.amazonaws.com'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'snaphomz.s3.eu-north-1.amazonaws.com',
        port: ''
      },
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        port: ''
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: ''
      },
      {
        protocol: 'https',
        hostname: 'dx41nk9nsacii.cloudfront.net',
        port: ''
      },
      {
        protocol: 'https',
        hostname: '*.amazonaws.com',
        port: ''
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: ''
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
        port: ''
      },
      {
        protocol: 'https',
        hostname: 'imagecdn.realty.com',
        port: ''
      }
    ]
  },
  transpilePackages: ['lucide-react'],
  reactStrictMode: true,
  swcMinify: true,
  future: {
    webpack5: true
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.pdf$/,
      use: 'file-loader'
    })
    return config
  }
}

export default nextConfig
