import Experience from '../Experience.js'
import Environment from './Environment.js'
import Floor from './Floor.js'
import Fox from './Fox/Fox.js'
import Portal from './Portal/Portal.js'
import UnderConstruction from './UnderConstruction.js'

export default class World
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources

        // Wait for resources
        this.resources.on('ready', () =>
        {
            // Setup
            
            this.fox = new Fox()
            this.floor = new Floor()
            this.portal = new Portal()
            this.environment = new Environment()
            //this.placeHolder = new UnderConstruction()
        })
    }

    update()
    {
        if(this.fox){
            this.fox.update()
        }
        if(this.portal){
            this.portal.update()
        }   
    }
}