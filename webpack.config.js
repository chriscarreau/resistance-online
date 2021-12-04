"use strict";
var webpack = require('webpack');
var path = require('path');
var rules = require('./webpack.loaders');
var HtmlWebpackPlugin = require('html-webpack-plugin');

const HOST = process.env.HOST || "localhost";
const PORT = process.env.PORT || "8080";

module.exports = {
	entry: [
		'react-hot-loader/patch',
		'./Client/index.tsx' // your app's entry point
	],
	devtool: process.env.WEBPACK_DEVTOOL || 'eval-source-map',
	output: {
		path: __dirname  + '/Client/static/',
		filename: 'bundle.js'
	},
	resolve: {
		extensions: ['', '.js', '.jsx', '.ts', '.tsx']
	},
	module: {
		rules
	},
	// mode: 'development',
	devServer: {
		open: true,
		hot: true,
		port: PORT,
		host: HOST
	},
	plugins: [
		new webpack.NoEmitOnErrorsPlugin(),
		new webpack.HotModuleReplacementPlugin(),
		new HtmlWebpackPlugin({
			template: './Client/template.html'
		}),
	]
};
