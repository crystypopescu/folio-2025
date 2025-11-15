import { Game } from '../Game.js'
import { InstancedGroup } from '../InstancedGroup.js'

export class Benches
{
    constructor()
    {
        this.game = Game.getInstance()

        // Base and references
        const [ base, references ] = InstancedGroup.getBaseAndReferencesFromInstances(this.game.resources.benchesModel.scene.children)
        base.traverse(child =>
        {
            if(child.isMesh)
            {
                child.castShadow = true
                child.receiveShadow = true
                child.frustumCulled = true
            }
        })

        // Descriptions > To extract colliders
        const descriptions = this.game.objects.getFromModel(base, {}, {})
        
        // Update materials 
        this.game.materials.updateObject(base)

        // Setup base
        for(const child of base.children)
            child.name = child.name.replace(/[0-9]+$/i, '') // Set clear name to retrieve it later as instances

        // Physics
        for(const reference of references)
        {
            this.game.objects.add(
                {
                    model: reference,
                    updateMaterials: false,
                    parent: null,
                },
                {
                    type: 'dynamic',
                    position: reference.position,
                    rotation: reference.quaternion,
                    friction: 0.7,
                    mass: 0.1,
                    sleeping: true,
                    colliders: descriptions[1].colliders,
                    waterGravityMultiplier: - 1,
                    contactThreshold: 10,
                    onCollision: (force, position) =>
                    {
                        // this.game.audio.groups.get('hitMetal').playRandomNext(force, position)
                    }
                },
            )
        }

        // Instanced group
        this.testInstancedGroup = new InstancedGroup(references, base, true)
    }
}