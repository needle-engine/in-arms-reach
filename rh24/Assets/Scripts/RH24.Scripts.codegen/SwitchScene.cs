// NEEDLE_CODEGEN_START
// auto generated code - do not edit directly

#pragma warning disable

namespace Needle.Typescript.GeneratedComponents
{
	public partial class SwitchScene : UnityEngine.MonoBehaviour
	{
		public float @startScene = 0f;
		public UnityEngine.GameObject[] @scenes = new UnityEngine.GameObject[]{ };
		public void OnEnable(){}
		public void setScene(float @index){}
	}
}

// NEEDLE_CODEGEN_END

#if UNITY_EDITOR

namespace Needle.Typescript.GeneratedComponents
{
	using UnityEditor;
	using UnityEngine;
	
	[CustomEditor(typeof(SwitchScene))]
	public class SwitchSceneEditor: Editor
	{
		public override void OnInspectorGUI()
		{
			var t = target as SwitchScene;
			DrawDefaultInspector();
			EditorGUILayout.Space();
			
			if (GUILayout.Button("Water"))
				SetScene(0);

			if (GUILayout.Button("Ice"))
				SetScene(1);
			
			if (GUILayout.Button("Fire"))
				SetScene(2);
		}

		void SetScene(int index)
		{
			var t = target as SwitchScene;
			for (int i = 0; i < t.scenes.Length; i++)
				t.scenes[i].SetActive(i == index);
		}
	}
}

#endif