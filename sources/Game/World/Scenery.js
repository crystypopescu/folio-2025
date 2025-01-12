import { Game } from '../Game.js'

export class Scenery
{
    constructor()
    {
        this.game = Game.getInstance()

        this.setStatic()
        this.setDynamics()
    }

    setStatic()
    {
        const visualModel = this.game.resources.sceneryStaticVisualModel
        
        this.game.materials.updateObject(visualModel.scene)
        visualModel.scene.traverse(_child =>
        {
            if(_child.isMesh)
            {
                _child.castShadow = true
                _child.receiveShadow = true
            }
        })

        this.game.scene.add(visualModel.scene)
    }

    setDynamics()
    {
        
    }
}