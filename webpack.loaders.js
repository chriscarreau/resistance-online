module.exports = [
	{
		test: /\.jsx?$/,
		exclude: /(node_modules|bower_components|public)/,
		use: [{loader: "babel"}]
	},
	{
		test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
		exclude: /(node_modules|bower_components)/,
		use: [{loader: "file"}]
	},
	{
		test: /\.(woff|woff2)$/,
		exclude: /(node_modules|bower_components)/,
		use: [{
			loader: "url",
			options: {
				prefix: "font/",
				limit: 5000
			}
		}]
	},
	{
		test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
		exclude: /(node_modules|bower_components)/,
		use: [{
			loader: "url",
			options: {
				mimetype: "application/octet-stream",
				limit: 10000
			}
		}]
	},
	{
		test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
		exclude: /(node_modules|bower_components)/,
		use: [{
			loader: "url",
			options: {
				mimetype: "image/svg+xml",
				limit: 10000
			}
		}]
	},
	{
		test: /\.gif/,
		exclude: /(node_modules|bower_components)/,
		use: [{
			loader: "url-loader",
			options: {
				mimetype: "image/gif",
				limit: 10000
			}
		}]
	},
	{
		test: /\.jpg/,
		exclude: /(node_modules|bower_components)/,
		use: [{
			loader: "url-loader",
			options: {
				mimetype: "image/jpg",
				limit: 10000
			}
		}]
	},
	{
		test: /\.png/,
		exclude: /(node_modules|bower_components)/,
		use: [{
			loader: "url-loader",
			options: {
				mimetype: "image/png",
				limit: 10000
			}
		}]
	},
	{ 
		test: /\.tsx?$/,
		use: [{loader: "ts-loader"}]
	},
];
