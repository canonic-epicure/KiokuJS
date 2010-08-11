Role('KiokuJS.Meta.Attribute.Intrinsic', {
    
    does    : 'KiokuJS.Meta.Aspect.AfterCollapse',
    
    
    
    after : {
        
        
        afterCollapse : function (instance, value, node) {
            
            if (value instanceof KiokuJS.Node) value.intrinsic = true
        }
    }
    
})
