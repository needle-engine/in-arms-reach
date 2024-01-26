using UnityEditor;
using UnityEngine;
using UnityEngine.Rendering;

public class CheckSettings : MonoBehaviour
{
    [MenuItem("Tools/Fix Lighting Settings")] 
    public static void LightsUseLinearIntensity()
    {
        GraphicsSettings.lightsUseLinearIntensity = true;
        GraphicsSettings.lightsUseColorTemperature = true;
    }
}
