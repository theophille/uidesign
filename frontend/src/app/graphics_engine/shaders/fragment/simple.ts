export const simpleFS: string = `#version 300 es
    precision mediump float;
    // Output of the shader
    out vec4 fragColor;
    
    void main() {
    // Output a constant red color
    fragColor = vec4(1.0, 0.0, 0.0, 1.0);
    }
`;