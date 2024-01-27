import { AudioSource, Behaviour, GameObject, serializable } from "@needle-tools/engine";

// Documentation → https://docs.needle.tools/scripting

export class PlaySoundCustom extends Behaviour {

    @serializable(AudioSource) 
    private source: AudioSource | null = null;


  
    onEnable(): void {
        this.source = this.gameObject.getComponent(AudioSource);
    }
  
    play() {
      if (this.source) {
        this.source.play();
      }
      
}
}