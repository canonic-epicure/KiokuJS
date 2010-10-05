Role('KiokuJS.Feature.Attribute.Lazy', {
    
    does    : 'KiokuJS.Aspect.AfterCollapse',
    
    
    
    after : {
        
        afterCollapse : function (instance, value) {
            
            if (value instanceof KiokuJS.Node) value.lazy = true
        }
    }
})
