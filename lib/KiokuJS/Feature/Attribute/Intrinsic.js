Role('KiokuJS.Feature.Attribute.Intrinsic', {
    
    does    : 'KiokuJS.Aspect.AfterCollapse',
    
    
    
    after : {
        
        
        afterCollapse : function (instance, value, node) {
            
            if (value instanceof KiokuJS.Node) value.intrinsic = true
        }
    }
    
})
