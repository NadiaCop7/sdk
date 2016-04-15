/* global describe, it */

var assert = require('chai').assert;
var raf = require('raf');
raf.polyfill();
var ol = require('openlayers');

var MapConfigService = require('../../js/services/MapConfigService.js');

describe('MapConfigService', function() {

  it('returns the correct layer type', function() {
    var type = MapConfigService.getLayerType(new ol.layer.Group());
    assert.equal(type, 'Group');
    type = MapConfigService.getLayerType(new ol.layer.Vector());
    assert.equal(type, 'Vector');
    type = MapConfigService.getLayerType(new ol.layer.Tile());
    assert.equal(type, 'Tile');
    type = MapConfigService.getLayerType(new ol.layer.Image());
    assert.equal(type, 'Image');
  });

  it('returns the correct format type', function() {
    var type = MapConfigService.getFormatType(new ol.format.GeoJSON());
    assert.equal(type, 'GeoJSON');
  });

  it('returns the correct source config for TileWMS', function() {
    var source = new ol.source.TileWMS({
      url: '/geoserver/wms',
      params: {
        LAYERS: 'foo'
      }
    });
    var config = MapConfigService.getSourceConfig(source);
    assert.equal(config.type, 'TileWMS');
    assert.equal(config.properties.params.LAYERS, 'foo');
    assert.equal(config.properties.urls[0], '/geoserver/wms');
  });

  it('returns the correct source config for Vector and Cluster', function() {
    var source = new ol.source.Vector({
      url: '/test.json',
      format: new ol.format.GeoJSON()
    });
    var config = MapConfigService.getSourceConfig(source);
    assert.equal(config.type, 'Vector');
    assert.equal(config.properties.url, '/test.json');
    assert.equal(config.properties.format.type, 'GeoJSON');
    var cluster = new ol.source.Cluster({
      source: source
    });
    config = MapConfigService.getSourceConfig(cluster);
    assert.equal(config.type, 'Cluster');
    assert.equal(config.source.type, 'Vector');
  });

  it('returns the correct source config for ImageWMS', function() {
    var source = new ol.source.ImageWMS({
      url: '/geoserver/wms',
      params: {
        LAYERS: 'foo'
      }
    });
    var config = MapConfigService.getSourceConfig(source);
    assert.equal(config.type, 'ImageWMS');
    assert.equal(config.properties.params.LAYERS, 'foo');
    assert.equal(config.properties.url, '/geoserver/wms');
  });

  it('returns the correct source config for MapQuest', function() {
    var source = new ol.source.MapQuest({
      layer: 'sat'
    });
    var config = MapConfigService.getSourceConfig(source);
    assert.equal(config.type, 'MapQuest');
    assert.equal(config.properties.layer, 'sat');
  });

  it('returns the correct layer config for vector / cluster layer (and vice versa)', function() {
    var layer = new ol.layer.Vector({
      source: new ol.source.Cluster({
        source: new ol.source.Vector({
          url: 'foo.json',
          format: new ol.format.GeoJSON()
        })
      })
    });
    var config = {};
    config = MapConfigService.getLayerConfig(config, layer);
    assert.equal(config.type, 'Vector');
    var result = MapConfigService.generateLayerFromConfig(config);
    assert.equal(result instanceof ol.layer.Vector, true);
    assert.equal(result.getSource() instanceof ol.source.Cluster, true);
    assert.equal(result.getSource().getSource() instanceof ol.source.Vector, true);
    assert.equal(result.getSource().getSource().getUrl(), 'foo.json');
    assert.equal(result.getSource().getSource().getFormat() instanceof ol.format.GeoJSON, true);
  });

  it('returns the correct layer config for tiled layer (and vice versa)', function() {
    var layer = new ol.layer.Tile({
      visible: false,
      title: 'My Layer',
      source: new ol.source.MapQuest({
        layer: 'sat'
      })
    });
    var config = {};
    config = MapConfigService.getLayerConfig(config, layer);
    assert.equal(config.type, 'Tile');
    assert.equal(config.properties.visible, false);
    assert.equal(config.properties.title, 'My Layer');
    var result = MapConfigService.generateLayerFromConfig(config);
    assert.equal(result instanceof ol.layer.Tile, true);
    assert.equal(result.get('title'), 'My Layer');
    assert.equal(result.getVisible(), false);
    assert.equal(result.getSource() instanceof ol.source.MapQuest, true);
    assert.equal(result.getSource().getLayer(), 'sat');
  });

  it('returns the correct layer config for group layer (and vice versa)', function() {
    var layer = new ol.layer.Group({
      layers: [
        new ol.layer.Tile({
          source: new ol.source.MapQuest({
            layer: 'sat'
          })
        }),
        new ol.layer.Tile({
          source: new ol.source.MapQuest({
            layer: 'osm'
          })
        })
      ]
    });
    var config = {};
    config = MapConfigService.getLayerConfig(config, layer);
    assert.equal(config.type, 'Group');
    assert.equal(config.children[0].type, 'Tile');
    assert.equal(config.children[0].source.type, 'MapQuest');
    assert.equal(config.children[1].type, 'Tile');
    var result = MapConfigService.generateLayerFromConfig(config);
    assert.equal(result instanceof ol.layer.Group, true);
    assert.equal(result.getLayers().item(0) instanceof ol.layer.Tile, true);
    assert.equal(result.getLayers().item(0).getSource() instanceof ol.source.MapQuest, true);
    assert.equal(result.getLayers().item(0).getSource().getLayer(), 'sat');
    assert.equal(result.getLayers().item(1) instanceof ol.layer.Tile, true);
    assert.equal(result.getLayers().item(1).getSource() instanceof ol.source.MapQuest, true);
    assert.equal(result.getLayers().item(1).getSource().getLayer(), 'osm');
  });

});
