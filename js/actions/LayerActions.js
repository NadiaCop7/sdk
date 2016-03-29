/*
 * Copyright 2015-present Boundless Spatial Inc., http://boundlessgeo.com
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and limitations under the License.
 */

import LayerConstants from '../constants/LayerConstants.js';
import AppDispatcher from '../dispatchers/AppDispatcher.js';

export default {
  selectLayer: (layer, cmp) => {
    AppDispatcher.handleAction({
      type: LayerConstants.SELECT_LAYER,
      layer: layer,
      cmp: cmp
    });
  },
  removeLayer: (layer) => {
    AppDispatcher.handleAction({
      type: LayerConstants.REMOVE_LAYER,
      layer: layer
    });
  },
  moveLayerDown: (layer) => {
    AppDispatcher.handleAction({
      type: LayerConstants.MOVE_LAYER_DOWN,
      layer: layer
    });
  },
  moveLayerUp: (layer) => {
    AppDispatcher.handleAction({
      type: LayerConstants.MOVE_LAYER_UP,
      layer: layer
    });
  },
  editLayer: (layer) => {
    AppDispatcher.handleAction({
      type: LayerConstants.EDIT_LAYER,
      layer: layer
    });
  },
  styleLayer: (layer) => {
    AppDispatcher.handleAction({
      type: LayerConstants.STYLE_LAYER,
      layer: layer
    });
  }
};
