export class ShaderProgram {
  private gl!: WebGL2RenderingContext;
  private vertexShaderSource: string | null = null;
  private fragmentShaderSource: string | null = null;
  private shaderProgram: WebGLProgram | null = null;

  constructor(glContext: WebGL2RenderingContext, vertexShaderSource: string, fragmentShaderSource: string) {
    this.gl = glContext;
    this.vertexShaderSource = vertexShaderSource;
    this.fragmentShaderSource = fragmentShaderSource;
    this.createShaderProgram();
  }

  // static async create(glContext: WebGL2RenderingContext, shaderName: string): Promise<ShaderProgram> {
  //   const vertexShaderSource = await import(`vertex/${shaderName}.ts`);
  //   const fragmentShaderSource = await import(`fragment/${shaderName}.ts`);
  //   return new ShaderProgram(glContext, vertexShaderSource, fragmentShaderSource);
  // }

  private compileShader(source: string | null, type: ShaderTypes, program: WebGLProgram): void {
    if (source) {
      const shaderType = type === ShaderTypes.VERTEX ? this.gl.VERTEX_SHADER : this.gl.FRAGMENT_SHADER;
      let shader: WebGLShader | null = this.gl.createShader(shaderType);

      if (shader) {
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);

        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
          const err = this.gl.getShaderInfoLog(shader);
          console.error(err);
          return;
        }

        this.gl.attachShader(program, shader);
        // this.gl.deleteShader(shader);
      }
    }
  }
  
  private createShaderProgram(): void {
    this.shaderProgram = this.gl.createProgram();
    this.compileShader(this.vertexShaderSource, ShaderTypes.VERTEX, this.shaderProgram as WebGLProgram);
    this.compileShader(this.fragmentShaderSource, ShaderTypes.FRAGMENT, this.shaderProgram as WebGLProgram);
    this.gl.linkProgram(this.shaderProgram  as WebGLProgram);

    if (!this.gl.getProgramParameter(this.shaderProgram as WebGLProgram, this.gl.LINK_STATUS)) {
      const err = this.gl.getProgramInfoLog(this.shaderProgram as WebGLProgram);
      console.error(err);
      throw new Error("Shader program linking failed.");
    }
  }

  public use(): void {
    this.gl.useProgram(this.shaderProgram);
  }
}

enum ShaderTypes {
  VERTEX,
  FRAGMENT
}