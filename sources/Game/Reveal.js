import * as THREE from 'three/webgpu'
import { color, uniform, vec2 } from 'three/tsl'
import { Game } from './Game.js'
import gsap from 'gsap'

export class Reveal
{
    constructor()
    {
        this.game = Game.getInstance()
        
        this.step = -1
        const respawn = this.game.respawns.getDefault()
        this.position = respawn.position.clone()
        this.position2Uniform = uniform(vec2(this.position.x, this.position.z))
        this.distance = uniform(0)
        this.thickness = uniform(0.05)
        this.color = uniform(color('#e88eff'))
        this.intensity = uniform(5.5)
        this.intensityMultiplier = 1
        this.sound = this.game.audio.register({
            path: 'sounds/reveal/reveal-1.mp3',
            autoplay: false,
            loop: false,
            volume: 0.5,
            preload: true
        })

        if(this.game.debug.active)
        {
            this.debugPanel = this.game.debug.panel.addFolder({
                title: '📜 Reveal',
                expanded: false,
            })

            this.debugPanel.addBinding(this.distance, 'value', { label: 'distance', min: 0, max: 20, step: 0.01 })
            this.debugPanel.addBinding(this.thickness, 'value', { label: 'thickness', min: 0, max: 1, step: 0.001 })
            // this.game.debug.addThreeColorBinding(this.debugPanel, this.color.value, 'color')
            this.debugPanel.addBinding(this.intensity, 'value', { label: 'intensity', min: 1, max: 20, step: 0.001 })
        }

        this.update = this.update.bind(this)
        this.game.ticker.events.on('tick', this.update, 10)
    }

    updateStep(step)
    {
        const speedMultiplier = location.hash.match(/skip/i) ? 4 : 1

        // Step 0
        if(step === 0)
        {
            // Grid
            this.game.world.grid.show()

            // Reveal - set immediately (no animation)
            this.distance.value = 3.5

            // View - set immediately (no animation)
            this.game.view.zoom.smoothedRatio = 0.3
            this.game.view.zoom.baseRatio = 0.3

            // Intro loader => Show label and sound button
            this.game.world.intro.setText()
            this.game.world.intro.setSoundButton()
            this.game.ticker.wait(1, () =>
            {
                this.game.world.intro.showLabel()
            })

            // Cherry trees
            if(this.game.world.cherryTrees)
                this.game.world.cherryTrees.leaves.seeThroughMultiplier = 0.5

            // Auto-proceed to step 1 (removed user interaction requirement)
            this.updateStep(1)
        }
        else if(step === 1)
        {
            // Audio
            this.game.audio.init()
            this.sound.play()

            // Reveal - set immediately (no animation)
            this.distance.value = 99999

            // Intro loader => Hide label
            this.game.world.intro.hideLabel()

            // Inputs
            this.game.inputs.filters.clear()
            this.game.inputs.filters.add('wandering')

            // View
            this.game.view.focusPoint.isTracking = true
            this.game.view.focusPoint.magnet.active = false

            // View - set immediately (no animation)
            this.game.view.zoom.baseRatio = 0

            // Cherry trees - set immediately (no animation)
            if(this.game.world.cherryTrees)
                this.game.world.cherryTrees.leaves.seeThroughMultiplier = 1

            // Proceed to step 2 immediately
            this.updateStep(2)
        }
        else if(step === 2)
        {
            this.game.interactivePoints.recover()
            
            this.game.world.step(2)
            this.game.world.grid.destroy()
            this.game.world.intro.destroy()
            this.game.world.intro = null

            this.game.server.start()

            this.game.ticker.events.off('tick', this.update)
        }

        this.step = step
    }

    update()
    {
        this.color.value.copy(this.game.dayCycles.properties.revealColor.value)
        this.intensity.value = this.game.dayCycles.properties.revealIntensity.value * this.intensityMultiplier
    }
}