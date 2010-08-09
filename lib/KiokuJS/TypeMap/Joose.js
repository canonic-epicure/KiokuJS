Class('KiokuJS.TypeMap.Joose', {
    
    isa     : 'KiokuJS.TypeMap',
    
    
    has : {
        forClass    : 'Joose.Meta.Object',
        inherit     : false
    },
    
        
    methods : {
        
        acquireIDFor : function (instance, desiredId) {
            if (instance.meta.does('KiokuJS.Feature.OwnID')) return instance.acquireID(desiredId)
            
            return this.SUPER(instance, desiredId)
        },
        
        
        collapse : function (instance, node, collapser) {
            
            var data = {}
            
            instance.meta.getAttributes().each(function (attribute, name) {
                
                data[ name ] = collapser.visit(attribute.getRawValueFrom(instance))
            })
            
            // instance has traits
            if (instance.meta.isDetached) node.traits = Joose.A.map(instance.meta.getRoles(), function (trait) {
                var traitName = trait.meta.name
                
                if (!traitName) throw "Can't serialize instance [" + instance + "] - it contains an anonymous trait"
                
                // XXX also extract the version of trait
                // and return { type : 'joose', token : traitName, version : traitVersion }
                return traitName
            })
            
            return data
            
            // XXX extract class version
        },
        
        
        clear : function (instance, node) {
            
            instance.meta.getAttributes().each(function (attribute, name) {
                
                delete instance[ attribute.slot ]
            })
        },
        
        
        createEmptyInstance : function (node) {
            var constructor     = node.getClass()
            
            if (node.traits) {
                constructor = constructor.meta.subClass({
                    does : node.traits 
                }, node.className)
                
                constructor.meta.isDetached = true
            }
            
            var f               = function () {}
            f.prototype         = constructor.prototype
            
            return new f()
        },
        
        
        populate : function (instance, node, expander) {
            var data = node.data
            
            // now that instance for `node.ID` is already pinned and we can assign its attributes (which can contain 
            // self-references for example)
            instance.meta.getAttributes().each(function (attribute, name) {
                
                attribute.setRawValueTo(instance, expander.visit(data[ name ]))
            })
            
            return instance
        }
    }

})
