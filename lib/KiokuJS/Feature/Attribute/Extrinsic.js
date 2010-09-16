Role('KiokuJS.Feature.Attribute.Extrinsic', {
    
    does    : 'KiokuJS.Aspect.AfterCollapse',
    
    
    
    after : {
        
        
        afterCollapse : function (instance, value) {
            
            if (value instanceof KiokuJS.Node) value.extrinsic = true
        }
    }
    
})
