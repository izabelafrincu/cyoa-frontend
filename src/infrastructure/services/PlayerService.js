import { BaseService } from './BaseService';
import { PlayerModel } from '../models/PlayerModel';

class PlayerService extends BaseService {
  getOrCreateEndpoint = 'public/player/getOrCreate/:story';
  updateEndpoint = 'public/player/updateAttributes/:playerId';
  deleteEndpoint = 'public/player';

  get = playerId => {
    let url = this.getOrCreateEndpoint;

    if (playerId) {
      url += `?playerId=${playerId}`;
    }

    return this.client
      .get(this.withRouteParams(url))
      .then(response => {
        return new PlayerModel(BaseService.onSuccess(response));
      });
  };

  update = metadata => {
    return this.client
      .put(this.withRouteParams(this.updateEndpoint), metadata)
      .then(response => {
        return new PlayerModel(BaseService.onSuccess(response));
      });
  };

  delete = playerId => {
    const url = this.deleteEndpoint + '/' + playerId;
    return this.client.delete(url).then(BaseService.onSuccess);
  };
}

export const playerService = new PlayerService();
