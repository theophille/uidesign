export const simpleVS: string = `#version 300 es
    // The attribute receiving vertex positions
    in vec2 aPosition;
    
    void main() {
    // Set the vertex position in clip space. The z value is 0, w is 1.
    gl_Position = vec4(aPosition, 0.0, 1.0);
    }
`;