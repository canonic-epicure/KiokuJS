Role('KiokuJS.Meta.Class.Intrinsic', {
    
    does    : 'KiokuJS.Meta.Aspect.AfterCollapse',
    
    
    
    after : {
        
        
        afterCollapse : function (node) {
            node.intrinsic = true
        }
    }
    
})
