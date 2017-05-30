varying vec4 diffuse, ambient, ambientGlobal;
varying vec3 normal, lightDir, halfVector;
varying float dist;

void main()
{
    float NdotL, NdotHV,att,spotEffect;
    vec3 halfV,n,viewV,ldir;
    vec4 color = ambientGlobal; //environment
    
    n = normalize(normal);
    
    NdotL = max(dot(n,lightDir),0.0);
    
    if(NdotL > 0.0)
    {
        spotEffect = dot(normalize(gl_LightSource[1].spotDirection),
                         normalize(-lightDir));
        
        if(spotEffect > gl_LightSource[1].spotCosCutoff)
        {
            spotEffect = pow(spotEffect, gl_LightSource[1].spotExponent);

            att = spotEffect/(gl_LightSource[1].constantAttenuation +
                       gl_LightSource[1].linearAttenuation * dist +
                       gl_LightSource[1].quadraticAttenuation * dist * dist);
            
            color += att * (diffuse * NdotL + ambient); // diffuse + environment
            
            halfV = normalize(halfVector);
            NdotHV = max(dot(halfV,n),0.0);
            
            color += att * gl_FrontMaterial.specular *
                     gl_LightSource[0].specular *
                     pow(NdotHV,gl_FrontMaterial.shininess);
        }
        
        att = 1.0/(gl_LightSource[0].constantAttenuation +
                   gl_LightSource[0].linearAttenuation * dist +
                   gl_LightSource[0].quadraticAttenuation * dist * dist);
        
        color += att * (diffuse * NdotL + ambient); // diffuse + environment
        
        halfV = normalize(halfVector);
        NdotHV = max(dot(halfV,n),0.0);
        
        color += att * gl_FrontMaterial.specular *
        gl_LightSource[0].specular *
        pow(NdotHV,gl_FrontMaterial.shininess);
    }
    
    gl_FragColor = color;
}
