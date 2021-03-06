import * as THREE from 'three'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import EventEmitter from './EventEmitter.js'
import gsap from 'gsap'
import Experience from '../Experience'

export default class Resources extends EventEmitter
{
    constructor(sources)
    {
        super()

        this.experience = new Experience()
        this.loading = this.experience.loading
        this.overlayMaterial = this.loading.overlayMaterial
        this.loadingElement = document.querySelector('.percent')
        this.sources = sources

        this.items = {}
        this.toLoad = this.sources.length
        this.loaded = 0

        this.setLoaders()
        this.startLoading()
    }

    setLoaders()
    {
        this.loaders = {}
        this.loaders.gltfLoader = new GLTFLoader()
        this.loaders.textureLoader = new THREE.TextureLoader()
        this.loaders.cubeTextureLoader = new THREE.CubeTextureLoader()
    }

    setDraco()
    {
        this.dracoLoader = new DRACOLoader()
        this.dracoLoader.setDecoderPath('/draco/')
        this.dracoGltfLoader = new GLTFLoader()
        this.dracoGltfLoader.setDRACOLoader(this.dracoLoader)
    }

    startLoading()
    {
        // Load each source
        for(const source of this.sources)
        {
            if(source.type === 'gltfModel')
            {
                this.loaders.gltfLoader.load(
                    source.path,
                    (file) =>
                    {
                        this.sourceLoaded(source, file)
                    }
                )
            }
            else if(source.type === 'texture')
            {
                this.loaders.textureLoader.load(
                    source.path,
                    (file) =>
                    {
                        this.sourceLoaded(source, file)
                    }
                )
            }
            else if(source.type === 'cubeTexture')
            {
                this.loaders.cubeTextureLoader.load(
                    source.path,
                    (file) =>
                    {
                        this.sourceLoaded(source, file)
                    }
                )
            }
            else if(source.type === 'dracoModel')
            {
                this.dracoGltfLoader.load(
                    source.path,
                    (file) => 
                    {
                        this.sourceLoaded(source, file)
                    }
                )
            }
        }
    }

    sourceLoaded(source, file)
    {
        this.items[source.name] = file

        this.loaded++

        this.loadedPercent = 0
        this.toLoadPercent = 100
        this.delay = 4000

        this.setNum = (currentNum, newNum) => {
            // console.log(this.loaded)
            // console.log(this.toLoad)
            // console.log(this.loadedPercent)
            // console.log(this.toLoadPercent)
            if(currentNum === newNum) return
            // if(currentNum === newNum && this.loadedPercent === 100){
            //     this.loadingElement.innerHTML = "Loading Complete"
            //     return
            // }
            this.updateSpeed = this.delay / Math.abs(currentNum - newNum)
            this.count = currentNum > newNum ? -1 : 1
            this.timer = setInterval(() => {
                if(currentNum <= 98){
                    currentNum += this.count
                }
                document.querySelector('.percent').innerHTML = "Loading " + currentNum + "%"
                if(currentNum === newNum - 1) clearInterval(this.timer)
            }, this.updateSpeed)
        }
        this.setNum(this.loadedPercent, this.toLoadPercent)

        if(this.loaded === this.toLoad)
        {
            this.trigger('ready')
            window.setTimeout(() => {
                gsap.to(this.overlayMaterial.uniforms.uAlpha, {duration:4, value: 0})
                this.loadingElement.innerHTML = "Loading Complete"
                this.loadingElement.classList.add('ended')
                // this.buttonsElement.classList.remove('off')
                // this.keyboardElement.classList.remove('off')
            }, 6000)
        }
    }
}