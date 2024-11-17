import * as THREE from 'three'
import { Game } from './Game.js'
import { output, color, sin, time, smoothstep, mix, matcapUV, float, mod, texture, transformNormalToView, uniformArray, varying, vertexIndex, rotateUV, cameraPosition, vec4, atan2, vec3, vec2, modelWorldMatrix, Fn, attribute, uniform } from 'three'

export class Lighting
{
    constructor()
    {
        this.game = new Game()

        this.spherical = new THREE.Spherical(50, 1.44, 1.31)
        this.count = 2
        this.lights = []
        this.mapSizeMin = 128

        for(let i = 0; i < this.count; i++)
        {
            const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
            directionalLight.position.setFromSpherical(this.spherical)
            directionalLight.castShadow = true
            
            const shadowAmplitude = 20
            directionalLight.shadow.camera.top = shadowAmplitude
            directionalLight.shadow.camera.right = shadowAmplitude
            directionalLight.shadow.camera.bottom = - shadowAmplitude
            directionalLight.shadow.camera.left = - shadowAmplitude
            directionalLight.shadow.camera.near = 1
            directionalLight.shadow.camera.far = 100

            const mapSize = this.mapSizeMin * Math.pow(2, i)
            directionalLight.shadow.mapSize.set(mapSize, mapSize)
            
            this.game.scene.add(directionalLight)
            this.game.scene.add(directionalLight.target)

            this.lights.push(directionalLight)
        }

        this.game.time.events.on('tick', () =>
        {
            this.update()
        })

        // Debug
        if(this.game.debug.active)
        {
            const debugPanel = this.game.debug.panel.addFolder({
                title: '💡 Lights',
                expanded: true,
            })

            debugPanel.addBinding(this.spherical, 'phi', { min: 0, max: Math.PI * 0.5 })
            debugPanel.addBinding(this.spherical, 'theta', { min: - Math.PI, max: Math.PI })
        }
    }

    update()
    {
        for(const light of this.lights)
        {
            light.position.setFromSpherical(this.spherical).add(this.game.view.focusPoint.position)
            light.target.position.copy(this.game.view.focusPoint.position)
        }
    }
}