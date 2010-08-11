Role('KiokuJS.Meta.Class.Intrinsic', {
    
    does    : 'KiokuJS.Meta.Aspect.AfterCollapse',
    
    
    
    after : {
        
        
        afterCollapse : function (instance, node) {
            node.intrinsic = true
        }
    }
    
})
